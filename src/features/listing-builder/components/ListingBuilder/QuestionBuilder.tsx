import { Button, HStack, Image, Text, VStack } from '@chakra-ui/react';
import React, { type Dispatch, type SetStateAction } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { type ListingStoreType } from '../../types';
import { QuestionCard } from './QuestionCard';

interface Props {
  setSteps: Dispatch<SetStateAction<number>>;
  draftLoading: boolean;
  createDraft: () => void;
  editable: boolean;
  isNewOrDraft?: boolean;
  isDuplicating?: boolean;
  useFormStore: () => ListingStoreType;
}

export interface Ques {
  order: number;
  question: string;
  type: 'text';
  delete?: boolean;
  options?: string[];
  label: string;
}

export const QuestionBuilder = ({
  setSteps,
  createDraft,
  draftLoading,
  isNewOrDraft,
  isDuplicating,
  useFormStore,
}: Props) => {
  const { form, updateState } = useFormStore();
  const { control, handleSubmit, register } = useForm({
    defaultValues: {
      eligibility: form?.eligibility,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'eligibility',
  });

  const onSubmit = (data: any) => {
    if (data.questions.length === 0) {
      toast.error('Add a minimum of one question');
      return;
    }
    const hasEmptyQuestions = data.questions.some((q: Ques) => !q.question);
    if (hasEmptyQuestions) {
      toast.error('All questions must be filled out');
      return;
    }
    updateState({ ...data });
    setSteps(5);
  };

  const onDraftClick = async (data: any) => {
    updateState({ ...data });
    createDraft();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack align={'start'} gap={3} w={'2xl'} pt={7}>
        <HStack gap={3} w={'full'} p={5} bg={'#F7FAFC'} rounded={'md'}>
          <Image alt={'hands'} src={'/assets/icons/hands.svg'} />
          <VStack align={'start'} justify={'start'}>
            <Text color={'#334254'} fontSize={'0.88rem'} fontWeight={600}>
              Note
            </Text>
            <Text mt={'0px !important'} color={'#94A3B8'} fontSize={'0.88rem'}>
              Names, Emails, Discord / Twitter IDs, SOL wallet and Profile Links
              are collected by default. Please use this space to ask about
              anything else!
            </Text>
          </VStack>
        </HStack>
        {fields.map((field, index) => (
          <QuestionCard
            key={field.id}
            register={register}
            index={index}
            remove={remove}
          />
        ))}
        <Button
          w={'full'}
          h={12}
          color={'#64758B'}
          bg={'#F1F5F9'}
          onClick={() =>
            append({
              order: fields.length + 1,
              question: '',
              type: 'text',
              label: '',
              options: [],
            })
          }
        >
          + Add Question
        </Button>
        <VStack gap={6} w={'full'} pt={10}>
          <Button w="100%" variant="solid">
            Continue
          </Button>
          <Button
            w="100%"
            isLoading={draftLoading}
            onClick={handleSubmit(onDraftClick)}
            variant="outline"
          >
            {isNewOrDraft || isDuplicating ? 'Save Draft' : 'Update Listing'}
          </Button>
        </VStack>
      </VStack>
    </form>
  );
};
