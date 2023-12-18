interface Person {
  name: string
}

export function hola(person: Person): string {
  return 'Hola ' + person.name + ' !!!!!!'
}
