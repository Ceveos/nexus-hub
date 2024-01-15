export function isSemanticVersion(version: string): boolean {
  const semVerRegex = /^[0-9]+\.[0-9]+\.[0-9]+$/;
  return semVerRegex.test(version);
}

export function isVersionLessThan(version: string, limit: string): boolean {
  const versionParts = version.split('.').map(Number);
  const limitParts = limit.split('.').map(Number);

  for (let i = 0; i < Math.max(versionParts.length, limitParts.length); i++) {
    const versionPart = versionParts[i] || 0;
    const limitPart = limitParts[i] || 0;

    if (versionPart < limitPart) {
      return true;
    } else if (versionPart > limitPart) {
      return false;
    }
  }

  return false; // Return false if version is equal to the limit
}