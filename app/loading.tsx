export default function Loading() {
  return (
    <main className="route-loading" aria-busy="true">
      <div className="route-loading-content" role="status" aria-live="polite">
        <span className="route-loading-track" aria-hidden="true">
          <span className="route-loading-bar" />
        </span>
        <span>페이지를 불러오는 중입니다.</span>
      </div>
    </main>
  );
}
