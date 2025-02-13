import { useState } from "react";

interface UseFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
}

interface UseFormResult<T> {
  data: T;
  setData: (newData: T) => void;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  errors: { [key: string]: string };
  processing: boolean;
  reset: () => void;
}

function useForm<T>(props: UseFormProps<T>): UseFormResult<T> {
  const [data, setData] = useState<T>(props.initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [processing, setProcessing] = useState<boolean>(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      await props.onSubmit(data);
    } catch (error: any) {
      // Assuming your API returns errors in a specific format
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        // Handle other errors (e.g., network errors)
        console.error("An error occurred:", error);
      }
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setData(props.initialValues);
    setErrors({});
  };

  return {
    data,
    setData,
    handleChange,
    handleSubmit,
    errors,
    processing,
    reset,
  };
}

export default useForm;
