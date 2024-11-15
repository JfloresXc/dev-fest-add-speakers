const TOKEN = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTlhNmQ5YjM2ZjM3MDYxMmQzNTQyZSIsImNvbGxlY3Rpb24iOiJ1c2VycyIsImVtYWlsIjoiY3Jpc3RpYW5zMTU5QGdtYWlsLmNvbSIsImlhdCI6MTczMTYyMzA1OCwiZXhwIjoxNzMxNjMwMjU4fQ.MuyLHPNakYpKq4nxAwudD6ZZcQ1yONoNZq8bFc9mnOM`;

const getConfirmedSpeakersFromSessionize = async () => {
  const response = await fetch(
    "https://sessionize.com/api/v2/457w18g3/view/Speakers"
  );
  const speakers = await response.json();
  return speakers;
};

const postImage = async (image) => {
  const imageUrl = image.urlImage;
  const responseImage = await fetch(imageUrl);
  const imageBlob = await responseImage.blob();
  const imageName = imageUrl.split("/").pop();

  const imageFile = new File([imageBlob], imageName, {
    type: imageBlob.type,
  });

  const formData = new FormData();

  const additionalData = {
    alt: image.alt,
    sizes: {
      card: {},
      tablet: {},
      thumbnail: {},
    },
  };

  formData.append("_payload", JSON.stringify(additionalData));
  formData.append("file", imageFile);

  const response = await fetch(
    `https://devfestlima-admin.onrender.com/api/media?depth=0&fallback-locale=null`,
    {
      method: "POST",
      headers: {
        Authorization: TOKEN,
      },
      body: formData,
    }
  );

  const data = await response.json();
  console.log(data);
  return data;
};

getConfirmedSpeakersFromSessionize().then(async (speakers) => {
  const images = speakers.map((speakerKey) => {
    return {
      urlImage: speakerKey.profilePicture,
      alt: speakerKey.fullName,
    };
  });

  for (const image of images) {
    await postImage(image);
  }
});
