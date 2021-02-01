const URL = 'http://localhost:8081'; // keeping url here we can move to env if more variables are available

export async function fetchDetails(clientId) {
  // we can use axios or any other third party but here we are using
  // fetch only as we need only one rest api call

  try {
    const response = await fetch(
      `${URL}/api/fetch-contact-details/${clientId}`,
      { method: 'GET' }
    );
    const output = await response.json();
    return output;
  } catch (err) {
    console.error(err);
    // show user the error from here if required
  }

  return [];
}

export async function fetchMessages(clientId, number) {
  try {
    const response = await fetch(
      `${URL}/api/fetch-contact-messages/${clientId}/${number}`,
      { method: 'GET' }
    );
    const output = await response.json();
    return output;
  } catch (err) {
    console.error(err);
    // show user the error from here if required
  }

  return [];
}

export function addNewSmsInStore({ from, message }) {
  let messages = sessionStorage.getItem(`webMessages_messages_${from}`);

  try {
    messages = JSON.parse(messages);
    messages = [
      {
        body: message,
        createdAt: new Date().toJSON(),
        isReply: true,
      },
      ...messages,
    ];
  } catch (err) {
    console.error(err);
  }

  saveMessageList(from, messages);

  return messages;
}

export async function updateActiveAndFetchMessagesIfRequired(number, clientId) {
  let messages = sessionStorage.getItem(`webMessages_messages_${number}`);
  if (!messages) {
    messages = await fetchMessages(clientId, number);
    saveMessageList(number, messages);
  } else {
    messages = JSON.parse(messages)
  }

  sessionStorage.setItem('webMessages_active', number);
  return messages;
}

export function saveMessageList(number, messages) {
  sessionStorage.setItem(
    `webMessages_messages_${number}`,
    JSON.stringify(messages)
  );
}

export async function sendNotification(from) {
  try {
    const result = await Notification.requestPermission();
    if (result === 'granted') {
      new Notification(`New Message from ${from}`);
    }
  } catch (err) {
    console.error(err);
    console.error('Denied');
  }
}

export function getMessagesFromStore(number) {

  let messages = sessionStorage.getItem(`webMessages_messages_${number}`);
  try {
    messages = JSON.parse(messages);
  } catch (err) {
    sessionStorage.setItem(`webMessages_messages_${number}`, JSON.stringify([]))
    messages = [];
  }

  return messages;

}
