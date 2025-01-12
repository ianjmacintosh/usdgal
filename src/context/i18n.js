// Create a new context to contain values for: site language, user language, and user location
// Follow KCD's [recommendations](https://kentcdodds.com/blog/how-to-use-react-context-effectively):
// * Export functional component to be used as a context provider
// * Export a custom hook to access context properties ([read more](https://kentcdodds.com/blog/how-to-use-react-context-effectively#the-custom-consumer-hook))
//   * Throw error when used outside provider
// * Use TypeScript union type to support creating a context with undefined initial value
// * Support async "user location" lookup via [helper function](https://kentcdodds.com/blog/how-to-use-react-context-effectively#what-about-async-actions)
