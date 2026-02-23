import { message } from 'antd';

export const showError = async (e: any) => {
  const err = await e;
  message.error(err?.message || e || 'Error occurred, please try again later');
};

export const validateMessages = {
  required: 'This field is required!',
  types: {
    email: 'Not a validate email!',
    number: 'Not a validate number!'
  },
  number: {
    // eslint-disable-next-line no-template-curly-in-string
    range: 'Must be between ${min} and ${max}'
  }
};
