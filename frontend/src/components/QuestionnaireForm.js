// components/QuestionnaireForm.js
import React from 'react';
import {
  Box, VStack, Heading, FormControl, FormLabel,
  Input, Radio, RadioGroup, Stack, Checkbox, Button,
  FormErrorMessage, Textarea, Slider, SliderTrack,
  SliderFilledTrack, SliderThumb, Text, Flex, Center, Spinner
} from '@chakra-ui/react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

const QuestionnaireForm = ({ questionnaire, onSubmit }) => {
  if (!questionnaire || !Array.isArray(questionnaire.questions)) {
    return <Center><Spinner size="lg" /></Center>;
  }

  const initialValues = questionnaire.questions.reduce((values, question) => {
    values[`question_${question.id}`] = question.question_type === 'checkbox' ? [] : '';
    return values;
  }, {});

  const validationSchema = Yup.object().shape(
    questionnaire.questions.reduce((schema, question) => {
      const fieldName = `question_${question.id}`;
      if (question.required) {
        schema[fieldName] = question.question_type === 'checkbox' 
          ? Yup.array().min(1, 'At least one option must be selected')
          : Yup.string().required('This field is required');
      }
      return schema;
    }, {})
  );

  const handleSubmit = (values) => {
    const answers = Object.entries(values).map(([key, value]) => {
      const questionId = parseInt(key.replace('question_', ''), 10);
      const question = questionnaire.questions.find(q => q.id === questionId);
      let answerText = null;
      let answerOptions = null;
      if (question.question_type === 'text') {
        answerText = value;
      } else if (question.question_type === 'radio' || question.question_type === 'rating') {
        answerOptions = [value];
      } else if (question.question_type === 'checkbox') {
        answerOptions = value;
      }
      return {
        question: questionId,
        answer_text: answerText,
        answer_options: answerOptions
      };
    });
    onSubmit(answers);
  };

  return (
    <Box maxW="800px" mx="auto" p={5}>
      <Heading as="h2" size="lg" mb={6}>{questionnaire.title}</Heading>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, isSubmitting }) => (
          <Form>
            <VStack spacing={8} align="stretch">
              {questionnaire.questions.sort((a, b) => a.order - b.order).map(question => (
                <Box key={question.id} p={5} borderWidth="1px" borderRadius="lg">
                  <Field name={`question_${question.id}`}>
                    {({ field, form }) => (
                      <FormControl isInvalid={errors[`question_${question.id}`] && touched[`question_${question.id}`]} isRequired={question.required}>
                        <FormLabel fontWeight="bold">{question.text}</FormLabel>
                        {question.question_type === 'text' && <Textarea {...field} placeholder="Enter your response" />}
                        {question.question_type === 'radio' && (
                          <RadioGroup {...field} value={field.value} onChange={(val) => form.setFieldValue(field.name, val)}>
                            <Stack>{Object.entries(question.options).map(([key, value]) => <Radio key={key} value={key}>{value}</Radio>)}</Stack>
                          </RadioGroup>
                        )}
                        <FormErrorMessage>{errors[`question_${question.id}`]}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Box>
              ))}
              <Button type="submit" colorScheme="teal" isLoading={isSubmitting} size="lg" isDisabled={isSubmitting}>Submit</Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default QuestionnaireForm;
