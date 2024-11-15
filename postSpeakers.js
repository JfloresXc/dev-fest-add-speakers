const TOKEN = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTlhNmQ5YjM2ZjM3MDYxMmQzNTQyZSIsImNvbGxlY3Rpb24iOiJ1c2VycyIsImVtYWlsIjoiY3Jpc3RpYW5zMTU5QGdtYWlsLmNvbSIsImlhdCI6MTczMTYwMzcwNCwiZXhwIjoxNzMxNjEwOTA0fQ.o4qSfJpz3R177iYrY6c-YecIsV3Z3Ols0WjPHUfz3pU`;

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

const getConfirmedSpeakersFromSessionize = async () => {
  const response = await fetch(
    "https://sessionize.com/api/v2/457w18g3/view/Speakers"
  );
  const speakers = await response.json();
  return speakers;
};

const getMissingSpeakers = async () => {
  const confirmedSpeakers = await getConfirmedSpeakersFromSessionize();
  const addedSpeakers = await getAddedSpeakers();

  const missingSpeakers = [];
  for (const confirmedSpeakerKey of confirmedSpeakers) {
    const fullNameC = `${confirmedSpeakerKey.firstName} ${confirmedSpeakerKey.lastName}`;

    let isSpeakerAdded = false;

    for (const addedSpeakerKey of addedSpeakers) {
      const fullNameA = `${addedSpeakerKey.firstName} ${addedSpeakerKey.lastName}`;

      if (fullNameA === fullNameC) {
        isSpeakerAdded = true;
        break; // Si se encuentra el speaker, no necesitamos seguir buscando en addedSpeakers
      }
    }

    // Si el speaker no fue encontrado en addedSpeakers, se agrega a missingSpeakers
    if (!isSpeakerAdded) {
      missingSpeakers.push(confirmedSpeakerKey);
    }
  }

  return missingSpeakers;
};

const getNetworks = (speaker) => {
  const allowedNetworks = [
    {
      platform: "twitter",
      url: "https://twitter.com/joelibaceta",
      id: "673634f1cfe8c9007db141d0",
    },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/joelibaceta/",
      id: "673634f1cfe8c9007db141d1",
    },
    {
      platform: "facebook",
      url: "https://www.facebook.com/joel.ibaceta",
      id: "673634f1cfe8c9007db141d2",
    },
    {
      platform: "instagram",
      url: "https://www.instagram.com/joelibaceta/",
      id: "673634f1cfe8c9007db141d3",
    },
  ];

  // Filtra y mapea solo las plataformas permitidas con sus IDs correspondientes
  const networks = allowedNetworks
    .filter((network) =>
      speaker.links.some(
        (link) => link.linkType.toLowerCase() === network.platform
      )
    )
    .map((network) => ({
      id: network.id,
      url: network.url,
      platform: network.platform,
    }));

  return networks;
};

// ------------------------------------------------------ TRANSFORM OBJECT
const generateIdRandom = (length = 24) => {
  let id = "";
  const digits = "0123456789";

  for (let i = 0; i < length; i++) {
    id += digits[Math.floor(Math.random() * digits.length)];
  }

  return id;
};
function transformSpeaker(speaker) {
  const allowedNetworks = [
    {
      platform: "twitter",
      url: "https://twitter.com/joelibaceta",
      id: "673634f1cfe8c9007db141d0",
    },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/joelibaceta/",
      id: "673634f1cfe8c9007db141d1",
    },
    {
      platform: "facebook",
      url: "https://www.facebook.com/joel.ibaceta",
      id: "673634f1cfe8c9007db141d2",
    },
    {
      platform: "instagram",
      url: "https://www.instagram.com/joelibaceta/",
      id: "673634f1cfe8c9007db141d3",
    },
  ];

  function extractNetworks(speaker) {
    return allowedNetworks
      .filter((network) =>
        speaker.links.some(
          (link) => link.linkType.toLowerCase() === network.platform
        )
      )
      .map((network) => ({
        id: network.id, // Usamos el ID de `allowedNetworks`
        url: speaker.links.find(
          (link) => link.linkType.toLowerCase() === network.platform
        ).url,
        platform: network.platform,
      }));
  }

  // Filtra y mapea solo las plataformas permitidas con sus IDs correspondientes
  const networks = extractNetworks(speaker);

  return {
    bio: speaker.bio,
    devfest: "6719a838b36f370612d35463", // ID fijo
    lastName: speaker.lastName,
    firstName: speaker.firstName,
    networks,
  };
}

// ----------------------------------------------- Agregar speaker
const postSpeaker = async (speaker) => {
  const response = await fetch(
    `https://devfestlima-admin.onrender.com/api/speakers?depth=0&fallback-locale=null`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
      },
      body: JSON.stringify(speaker),
    }
  );

  const data = await response.json();
  console.log(data);
  return data;
};

const newSpeakers = [];
getMissingSpeakers().then(async (speakers) => {
  console.log(`Cantidad de speakers faltantes: ${speakers.length}`);

  if (speakers.length <= 0) return;

  for (const speakerKey of speakers) {
    const newSpeaker = transformSpeaker(speakerKey);
    newSpeakers.push(newSpeaker);
  }

  for (const speakerKey of newSpeakers) {
    await postSpeaker(speakerKey);
  }
});
