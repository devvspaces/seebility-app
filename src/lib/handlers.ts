import { ErrorResponse } from "./api.types";

/**
 *
 * @param data Error response from the server
 * @param fields Fields to be handled
 * @param setFieldError Set state function for formik to set field error
 * @param toast Toast function from chakra ui
 */
export function formErrorHandler(
  data: ErrorResponse,
  fields: string[],
  setFieldError: (field: string, message: string) => void,
  toast: any
) {
  if (Array.isArray(data.message)) {
    data.message.forEach((message) => {
      let field = message.split(" ")[0].toLowerCase();
      if (fields.includes(field)) {
        setFieldError(field, message);
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      }
    });
  } else {
    toast({
      title: "Error",
      description: data.message,
      status: "error",
      duration: 9000,
      isClosable: true,
      position: "top-right",
    });
  }
}
