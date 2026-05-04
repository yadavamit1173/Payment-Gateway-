async function retryWithBackoff(fn, maxRetries = 3) {
  let delay = 300

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxRetries) throw error

      await new Promise(resolve => setTimeout(resolve, delay))
      delay = delay * 2
    }
  }
}