const fs = require('fs/promises')
const path = require("path");
const {nanoid} = require("nanoid")

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
const allContacts = await fs.readFile(contactsPath)
 return JSON.parse(allContacts) 
}

const getContactById = async (contactId) => {
  const contactById = await listContacts()
  const result = contactById.find(({ id }) => id === contactId)
  return result || null
}

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
   ...body
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;



//   const allContacts = await listContacts()
//   const newContact = {
//     id: nanoid(),
//     ...body
// }
//   allContacts.push(newContact)
//   await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2))
//   return newContact
}

const removeContact = async (contactId) => {}

const updateContact = async (contactId, body) => { }


module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
}
