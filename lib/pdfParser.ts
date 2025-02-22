import pdf from 'pdf-parse';

export const extractTextFromPDF = async (file: Buffer) => {
  const data = await pdf(file);
  return data.text;
};