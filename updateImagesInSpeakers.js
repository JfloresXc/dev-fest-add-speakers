const TOKEN = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTlhNmQ5YjM2ZjM3MDYxMmQzNTQyZSIsImNvbGxlY3Rpb24iOiJ1c2VycyIsImVtYWlsIjoiY3Jpc3RpYW5zMTU5QGdtYWlsLmNvbSIsImlhdCI6MTczMTYyMzA1OCwiZXhwIjoxNzMxNjMwMjU4fQ.MuyLHPNakYpKq4nxAwudD6ZZcQ1yONoNZq8bFc9mnOM`;

const getAddedSpeakers = async () => {
  const limit = 100;
  const response = await fetch(
    `https://devfestlima-admin.onrender.com/api/speakers?depth=0&draft=true&limit=${limit}&invoke=a78707a1-9d2a-4ee1-be27-2f74687d4040`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
      },
    }
  );

  const data = await response.json();
  const speakers = data.docs;
  return speakers;
};

const getUploadImages = async () => {
  const limit = 100;
  const response = await fetch(
    `https://devfestlima-admin.onrender.com/api/media?depth=0&draft=true&limit=${limit}&invoke=b2d031ac-e776-465d-88c0-d11e391ed900`,
    {
      method: "GET",
      headers: {
        Authorization: TOKEN,
      },
    }
  );
  const data = await response.json();
  return data.docs;
};

const patchSpeaker = async ({ speaker, id }) => {
  const url = `https://devfestlima-admin.onrender.com/api/speakers/${id}?depth=0&fallback-locale=null`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(speaker),
  });
  const data = await response.json();
  console.log(data);
};

function parseProfileData(data) {
  return {
    bio: data.bio,
    image: data.image,
    devfest: data.devfest,
    lastName: data.lastName,
    firstName: data.firstName,
    updatedAt: "2024-11-14T08:34:20.161Z",
    createdAt: "2024-11-14T03:34:20.167Z",
    networks: data.networks.map((network) => ({
      id: network.id,
      url: network.url,
      platform: network.platform,
    })),
  };
}

getAddedSpeakers().then(async (speakers) => {
  const uploadImages = await getUploadImages();
  const altsImages = uploadImages.map(({ id, alt = "" }) => {
    return { alt, id };
  });

  let contador = 0;
  for (const speakerKey of speakers) {
    const fullName = `${speakerKey.firstName} ${speakerKey.lastName}`;

    const findedImage = altsImages.find(({ alt }) => {
      return fullName == alt;
    });

    if (!findedImage) {
      console.log({
        message: "No encontrado: FullName " + fullName,
        speakerKey,
      });
      continue;
    }

    const newSpeaker = parseProfileData({
      ...speakerKey,
      image: findedImage.id,
    });

    await patchSpeaker({ speaker: newSpeaker, id: speakerKey.id });
    contador = contador + 1;
  }

  console.log(contador);
});
