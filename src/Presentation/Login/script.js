function sendData(email, password) {
  $.ajax({
    url: `${window.location.origin}/client-login`,
    contentType: 'application/json',
    dataType: 'json',
    method: 'POST',
    data: JSON.stringify({
      email,
      password,
    }),
  }).done((res) => {
    if (!res.code) {
      window.localStorage.setItem('acessToken', res.acessToken);
      window.localStorage.setItem('refreshToken', res.refreshToken);
    }
    console.log(res);
  });
}
