
export const convertBlobUrlsToFiles = async (blobUrls: (string | null)[]): Promise<File[]> => {
    // Filter out null values and convert the remaining Blob URLs to Files
    const files = await Promise.all(
      blobUrls
        .filter((url): url is string => url !== null) // Type guard to filter out null values
        .map(async (blobUrl, index) => {
          const response = await fetch(blobUrl);
          const blob = await response.blob();
          return new File([blob], `cropped-image-${index + 1}.jpg`, {
            type: blob.type,
            lastModified: Date.now(),
          });
        })
    );
    return files;
  };
  
  
 
  export const createFormData = (files:File[]) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });
    return formData;
  };
  