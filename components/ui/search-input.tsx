import { Button } from "@/components/ui/button";

type SearchInputProps = {
  placeholder?: string;
  defaultValue?: string;
  action?: string;
  inputName?: string;
  buttonLabel?: string;
};

export function SearchInput({
  placeholder = "지원금명, 키워드, 대상 검색",
  defaultValue,
  action = "/search",
  inputName = "q",
  buttonLabel = "검색",
}: SearchInputProps) {
  return (
    <form action={action} className="search-form">
      <div className="search-field">
        <span
          aria-hidden="true"
          style={{
            color: "var(--color-ink-muted)",
            fontSize: "14px",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ⌕
        </span>
        <input
          type="text"
          name={inputName}
          defaultValue={defaultValue}
          placeholder={placeholder}
          aria-label="지원금 검색"
          className="search-field-input"
          style={{
            border: 0,
            outline: "none",
            background: "transparent",
            color: "var(--color-ink)",
            fontSize: "var(--text-body-size)",
            lineHeight: 1.47,
          }}
        />
      </div>
      <div className="search-submit">
        <Button type="submit" size="sm">
          {buttonLabel}
        </Button>
      </div>
    </form>
  );
}