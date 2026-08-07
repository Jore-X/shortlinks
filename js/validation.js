async function search_if_exist(code) {
  const data = await searchLink(code);

  if (data) {
    console.log("O Link ja EXISTE");
    return true;
  } else {
    console.log("Link NÃO EXISTE");
    return false;
  }
}

function validateURL(string){
    return URL.canParse(string)
}