export function sortGuidesByFreshness(guides) {
  return [...guides].sort((left, right) => {
    const updatedDifference = right.updatedAt.localeCompare(left.updatedAt);
    if (updatedDifference !== 0) return updatedDifference;

    const publishedDifference = right.publishedAt.localeCompare(left.publishedAt);
    if (publishedDifference !== 0) return publishedDifference;

    return left.title.localeCompare(right.title, "ko");
  });
}
