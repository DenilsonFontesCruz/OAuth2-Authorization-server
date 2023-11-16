function sendData(email, password) {
  $.ajax({
    url: 'http://localhost:9102/client-login',
    method: 'POST',
    data: {
      email,
      password,
    },
  });
}
