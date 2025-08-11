import { Button, Title } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { getSuccessMessage } from '@utils/notification';
import { setSessionTransactionDate } from '@utils/transaction-date';
import { useTransition } from 'react';
import { BiCategoryAlt } from 'react-icons/bi';
import { MdUpdate as UpdateIcon } from 'react-icons/md';

interface EditModalProps {
  trnDate?: string | Date;
  onSuccess?: (newDate: Date) => void;
}

const EditModal = ({ trnDate, onSuccess }: EditModalProps) => {
  const [isLoading, startTransition] = useTransition();

  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      trnDate: trnDate ? new Date(trnDate) : new Date()
    }
  });

  const submitHandler = (formData: { trnDate: Date }) => {
    startTransition(async () => {
      try {
        const dateToStore = new Date(formData.trnDate);
        setSessionTransactionDate(dateToStore);

        showNotification(getSuccessMessage("Transaction date updated successfully"));
        closeAllModals();

        // Call the success callback if provided
        if (onSuccess) {
          onSuccess(dateToStore);
        }
      } catch (error) {
        showNotification({
          title: 'Error',
          message: 'Failed to update transaction date',
          color: 'red'
        });
      }
    });
  };

  return (
    <form onSubmit={onSubmit(submitHandler)}>
      <Title order={4} mb="md">
        Setup Transaction Date
      </Title>

      <DateInput
        label="Transaction Date"
        placeholder="Select date"
        withAsterisk
        mb="md"
        leftSection={<BiCategoryAlt />}
        valueFormat="DD-MM-YYYY"
        {...getInputProps('trnDate')}
      />

      <Button type="submit" leftSection={<UpdateIcon />} loading={isLoading}>
        Update
      </Button>
    </form>
  );
};

export default EditModal;