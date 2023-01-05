// Node modulen express installerat via NPM, hanterar http förfrågningar i NODEjs-backend
const express = require('express');
// Express objekt som i stort representerar en webbserver
const app = express();

// En till module som importers här Fs 
const fs = require('fs/promises');
// val av port 
const PORT = 5000;
// kallar på express objektet via var namn
app
// use methoden är för att sätta vår egna inställningar till vår server. 
// json och url encoded är metoder som existerar redan i express biblan.
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  // use igen för en till vilkor för själva förfrågningar, varje förfråga kommer gå via nedstående koden.
  .use((req, res, next) => {
    /* Det vill säga, alla response-objekt kommer att få nedanstående headers. */
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    // Funktionen next här är för att få förfrågan att bhandlas vidare 
    next();
  });

// Express modulen har olika metoder för att specificera vad som ska hända vid olika använding
// av crud metoder som redan finns inbygda i biblan.

/* 1-Första metoden Get, jobbet den gör är att den tar emot förfrågan ifrån servern
som har url:en(localhost :5000/task).

En callbackfunktion som kommer att köras när en sådan förfrågan görs.
Callbackfunktionen tar (minst) två parametrar - ett requestobjekt och ett responseobjekt, som här kallas
req och res. Callbackfunktionen är asynkron för att vi använder await inuti. */


app.get('/tasks', async (req, res) => {
  /* För enkel felhantering används try/catch */
  try {
// använder oss av Fs modulen för att kunna läsa av tasks.json formaten.
//sedan Anropet är asynkront så man sätter await innan (och async innan callbackfunktionen i app.get().
    const tasks = await fs.readFile('./tasks.json');
// Innehållet skickas tillbak till klienten, Vi kan kalla detta för ett success-response. Efter res.send är förfrågan färdigbehandlad och kopplingen
// mot servern kommer att stängas ned.
    res.send(JSON.parse(tasks));
  } catch (error) {
// här kommer användingen av felhanteringen ifall att det sker något misttag vid try så kommer catch att visas
// och man skickar istället ett response som har koden 500 (server error) och inkluderar felet.
    res.status(500).send({ error });
  }
});


/*2-Andra metoden som finns i express biblan, fungerar precis på samma sätt som Get methoden.*/
app.post('/tasks', async (req, res) => {


  try {
/*Förfrågan ifrån klinten(datan), hamnar i req objektet, och innhållet i datan hamnar då
 i själva req.body, I detta fall den uppgift som ska sparas ned.*/
    const task = req.body;
/*Innhållet i filen läses in och sparas i varibeln listBuffer */
    const listBuffer = await fs.readFile('./tasks.json');
/*För att kunna behandla listBuffer som har själva innhållet behöver vi använda parse
Parse är för att  översätta en buffer eller text till JavaScript */
    const currentTasks = JSON.parse(listBuffer);
/*Skapar en var där varje uppgift ska få en egen id, och den första börjar på 1 */
    let maxTaskId = 1;


/*en If-sats som säger om det finns något i currentTasks(innhåll) som är större än 0 så ska en
 ID tilldelas beroende på de som redan finns i filen */
    if (currentTasks && currentTasks.length > 0) {
/*Detta sker via reduce som kollar genom alla Element i array listan och.
sedan sparas den som har högsta id:et i Variabeln maxTaskId  */
      maxTaskId = currentTasks.reduce(
/*Varje element som läses av som JS med hjälp av currentTasks som innehåller parse, går via dessa två parmetrar 
maxId = Kommer innehålla det högsta ID:et
currentElement = representerar det aktuella element i currentTasks som man för närvarande 
kontrollerar.*/        
        (maxId, currentElement) =>
/*Om Id:et i den existerade uppgiten är större än det som finns i maxId var.
så ändras nummret som finns I id:et till den högsta igen */          
          currentElement.id > maxId ? currentElement.id : maxId,
        maxTaskId);
}

/*varibel newTask Har så att det skapas en ny uppgift som skickades in och är färdig behnandlad
Det hämtas via task som har reqbody där innhållet av data finns.Med hjälp av reduce och +1 så äkar ID:et
Det befintliga objektet och det nya id:t slås ihop till ett nytt objekt med hjälp av spreadoperatorn */
    const newTask = { id: maxTaskId + 1, ...task };
  // ifall att currentTasks har frf existeranda data så läggs den in i den nya arrayen då hamnar både tidigare uppgifter och den befntliga tsm.
  //om inte då innhåller arraylist bara den nya uppgiften.
    const newList = currentTasks ? [...currentTasks, newTask] : [newTask];

/*gör om lista ntill en textsträng med hjälp av JSON.stringify och den sparas ner till tasks.json med hjälp av
Writefile methoden som finns i FS modulen. Anropet är asynkront så await används för att invänta
svaret innan koden går vidare. */
    await fs.writeFile('./tasks.json', JSON.stringify(newList));
    res.send(newTask);

  } catch (error) {
// Vid fel skickas statuskod 500 och information om felet.
    res.status(500).send({ error: error.stack });
  }
});

/*3-Tredje metoden som finns i express Modulen DELETE (), fungerar  på samma sätt som Get och post methoden.
Här har vi med Id efter task vilket innebär att man kan skriva id nummert efter task för att ta bort själva uppgifen */

app.delete('/tasks/:id', async (req, res) => {
  console.log(req);

  try {
/* För att nå egenskaper tagna ur url:en  använder man req.params och sedan namnet som man gett
egenskapen, i detta fall id, då vi skrev :id. */
    const id = req.params.id;
    /* På samma sätt som vid post, hämtas filens befintliga innehåll ut med hjälp av
    fs.readFile, som inväntas med await. */
    const listBuffer = await fs.readFile('./tasks.json');
    /* Innehållet i filen parsas till JavaScript för att kunna behandlas vidare i kod. */
    const currentTasks = JSON.parse(listBuffer);
    /* Först en kontroll om det ens finns något i filen, annars finns ju inget att ta bort */
    if (currentTasks.length > 0) {

      /* Om det finns något i filen görs här en hel del i samma anrop: 
      1. De befintliga uppgifterna (currentTasks), filtreras så att den uppgift med det id 
      som skickades in filtreras bort och endast de uppgifter som inte hade det id:t är kvar.

      2. Arrayen med alla uppgifter utom den med det id som skickades in görs om till en
      sträng med JSON.stringify.

      3. Denna sträng sparas slutgilgingen till filen tasks.json, så att det kommer att
      finnas en uppdaterad lista som inte längre innehåller uppgiften med det id som skickades
      in via url:en. */

      await fs.writeFile(
        './tasks.json',
        JSON.stringify(currentTasks.filter((task) => task.id != id))
      );
      /* När den nya listan har skrivits till fil skickas ett success-response  */
      res.send({ message: `Uppgift med id ${id} togs bort` });
    } else {

    /* Om det inte fanns något i filen sedan tidigare skickas statuskod 404. 404 används här
    för att det betyder "Not found", och det stämmer att den uppgift som man ville ta bort
    inte kunde hittas om listan är tom. Vi har dock inte kontrollerat inuti en befintlig lista
    om det en uppgift med det id som man önskar ta bort faktiskt finns. Det hade man också kunnat göra. */
      res.status(404).send({ error: 'Ingen uppgift att ta bort' });
    }
  } catch (error) {
/* Om något annat fel uppstår, skickas statuskod 500, dvs. ett generellt serverfel,
  tillsammans med information om felet.  */
    res.status(500).send({ error: error.stack });
  }
});

  /***********************Labb 2 ***********************/

  // ***************Mina Förklaringar******************//

  /*Eftersom vi inte ska ersätta uppgiterna som är slutförda med nya så är den mest lämpliga Patch.
  Patch går ut på att genomföra små ändringar i en uppgift som tex i vårt fall här. Och med hjälp av din förklaring så
  är det mest rätt ätt härma delete metoden eftersom vi ska ändra med hjälp av den unika ID */
  
  /***********************Labb 2 ***********************/
  
// Metoden patch för att uppdatera på listan utan att ta bort den helt.

  app.patch("/tasks/:id", async (req, res) => {
// Try och catch för enklare felhantering åtrigen
    try {
// Hämtar ID:en URl:en med hjälp av params
      const id = req.params.id;
// här hämtas filens befintliga innehåll ut med hjälp av fs.readFile, som inväntas med await.
      const listBuffer = await fs.readFile("./tasks.json"); 
/* Innehållet i filen parsas till JavaScript för att kunna behandlas vidare i kod. */
      const currentTasks = JSON.parse(listBuffer);
//  find-metoden för att hitta uppgiften i arrayen med hjälp av dess id. 
      const taskToUpdate = currentTasks.find(task => task.id == id);
// Om inte uppgifen inte hittas retuners det ett error.
    if (!taskToUpdate) {
      res.status(404).send({ error: `Task with id ${id} not found` });
      return;
    }
// annars om inget fel uppstår så uppdaters uppfiten.
    taskToUpdate.completed = !taskToUpdate.completed;
//Efter att uppgiften har uppdaterats skrivs arrayen med uppdaterade uppgifter tillbaka till filen med hjälp
//av fs.writeFile
    await fs.writeFile('./tasks.json', JSON.stringify(currentTasks));
//HTTP-statuskod 200 och ett lyckat-meddelande till klienten
    res.send({ message: `Task with id ${id} updated` });
// om något fel uppstår i Try så kommer det att fångas av Catch samt skickas statuskod och ett meddelande till klienten.
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});


  /***********************Labb 2 ***********************/

app.listen(PORT, () => console.log('Server running on http://localhost:5000'));
