class Api {

  url = '';

  constructor(url) {
    this.url = url;
  }
   
  
  create(data) {
    const JSONData = JSON.stringify(data);
    console.log(`Sending ${JSONData} to ${this.url}`);
    
    const request = new Request(this.url, {
      method: 'POST',
      body: JSONData,
      headers: {
        'content-type': 'application/json'
      }
    });

    return (
     
      fetch(request)
        .then((result) => result.json())
        .then((data) => data)
        .catch((err) => console.log(err))
    );
  }

  getAll() {
    return fetch(this.url)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  }

  remove(id) {
    console.log(`Removing task with id ${id}`);
    return fetch(`${this.url}/${id}`, {
      method: 'DELETE'
    })
      .then((result) => result)
      .catch((err) => console.log(err));
  }

  /***********************Labb 2 ***********************/

    // ***************Mina Förklaringar******************//

/*Update methoden som tillhör API:et den innehåller två argument här id, completed.
id = Numerisk identfering för en task, completed = boolesk variabel så antigen true eller false.
Completed skickas in som HTTP req med hjälp av stringfy, Sedan används fetch-funktionen för att göra en HTTP-request av typen "PATCH"
När requesten är klar returnerar metoden en promise med resultatet. antingen success eller error */

 /***********************Labb 2 ***********************/

  update(id, completed) {
    const JSONData = JSON.stringify(completed);
    
    
    return fetch(`${this.url}/${id}`, {
      method: "PATCH",
      body: JSONData,
      headers: {
        "content-type": "application/json",
      },
    })
    .then((result) => result)
    .catch((err) => result);
  }
}

  /***********************Labb 2 ***********************/
