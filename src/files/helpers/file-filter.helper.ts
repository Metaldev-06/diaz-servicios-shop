export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'];

  if (!validExtensions.includes(fileExtension)) {
    return callback(new Error('Invalid file extension'), false);
  }

  callback(null, true);
};
