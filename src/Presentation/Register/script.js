function sendData(email, password) {
  $.ajax({
    url: `${window.location.origin}/register`,
    contentType: 'application/json',
    dataType: 'json',
    method: 'POST',
    data: JSON.stringify({
      email,
      password,
    }),
  }).done((res) => {
    if (!res.code) {
      window.location = '/web/login';
    }
    console.log(res);
  });
}
