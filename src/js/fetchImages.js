function fetchImages() {
    return fetch(`${url}`).then(response => {
    if (!response.ok) {
      throw Error(`Error: ${response.status}`);
    }
    return response.json();
  });
}
