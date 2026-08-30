export function isImageSrc(value: string | undefined) {
  return Boolean(value && /^(https?:\/\/|data:)/i.test(value))
}
