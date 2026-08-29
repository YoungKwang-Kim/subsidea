create schema if not exists private;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  avatar_url text check (char_length(avatar_url) <= 2048),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.eligibility_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  age_group text check (
    age_group is null or age_group in ('under19', '19to34', '35to49', '50to64', '65plus')
  ),
  situations text[] not null default '{}',
  housing text check (
    housing is null or housing in ('jeonse', 'wolse', 'homeowner', 'other')
  ),
  income text check (
    income is null or income in ('under50', '50to100', '100to150', 'any')
  ),
  residence_sido text check (char_length(residence_sido) <= 20),
  interests text[] not null default '{}',
  profile_version integer not null default 1 check (profile_version > 0),
  consented_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint eligibility_profiles_situations_check check (
    situations <@ array[
      'job-seeking', 'employed', 'self-employed', 'parenting',
      'student', 'senior', 'medical'
    ]::text[]
  )
);

create table public.saved_grants (
  user_id uuid not null references auth.users(id) on delete cascade,
  grant_slug text not null check (
    char_length(grant_slug) between 1 and 160
    and grant_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  status text not null default 'interested' check (
    status in ('interested', 'preparing', 'applied', 'received', 'dismissed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, grant_slug)
);

create table public.consent_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  consent_type text not null check (
    consent_type in ('terms', 'privacy', 'profile_sync', 'sensitive_profile')
  ),
  policy_version text not null check (char_length(policy_version) between 1 and 40),
  agreed_at timestamptz not null default now()
);

create index saved_grants_user_status_idx
  on public.saved_grants (user_id, status, updated_at desc);
create index consent_history_user_agreed_idx
  on public.consent_history (user_id, agreed_at desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name, avatar_url)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'), 80),
    left(new.raw_user_meta_data ->> 'avatar_url', 2048)
  );
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger eligibility_profiles_set_updated_at
before update on public.eligibility_profiles
for each row execute function private.set_updated_at();

create trigger saved_grants_set_updated_at
before update on public.saved_grants
for each row execute function private.set_updated_at();

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.eligibility_profiles enable row level security;
alter table public.saved_grants enable row level security;
alter table public.consent_history enable row level security;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "profiles_delete_own"
on public.profiles for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "eligibility_profiles_select_own"
on public.eligibility_profiles for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "eligibility_profiles_insert_own"
on public.eligibility_profiles for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "eligibility_profiles_update_own"
on public.eligibility_profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "eligibility_profiles_delete_own"
on public.eligibility_profiles for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "saved_grants_select_own"
on public.saved_grants for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "saved_grants_insert_own"
on public.saved_grants for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "saved_grants_update_own"
on public.saved_grants for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "saved_grants_delete_own"
on public.saved_grants for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "consent_history_select_own"
on public.consent_history for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "consent_history_insert_own"
on public.consent_history for insert
to authenticated
with check ((select auth.uid()) = user_id);

revoke all on schema private from public, anon, authenticated;
revoke all on all functions in schema private from public, anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.eligibility_profiles to authenticated;
grant select, insert, update, delete on public.saved_grants to authenticated;
grant select, insert on public.consent_history to authenticated;
grant usage, select on sequence public.consent_history_id_seq to authenticated;
