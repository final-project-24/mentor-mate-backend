// Function capitalizes first character only, regardless of the string length or structure
const capitalizeFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default capitalizeFirstChar
