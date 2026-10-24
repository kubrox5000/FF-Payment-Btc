/** Bound optional work without leaving a timer alive after it settles. */
export async function withDeadline<T>(work: Promise<T>, milliseconds: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      work.catch(() => fallback),
      new Promise<T>(resolve => { timer = setTimeout(() => resolve(fallback), milliseconds) }),
    ])
  } finally {
    clearTimeout(timer)
  }
}
