import { Injectable } from '@angular/core';
import { Group } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  // Aggiungo qualche gruppo mockato
  // TODO: Da valutare l'inserimento di un JSON Server per mockare le chiamate direttamente
  private groups: Group[] = [
    {
      id: '1',
      name: 'Cavalieri della Tavola Rotonda',
      description: '',
      adminId: '1',
      memberIds: ['1', '2'],
      inviteCode: 'CAMELOT',
      createdAt: new Date('2024-12-01')
    },
    {
      id: '2',
      name: 'Avalon Beginners',
      description: 'Per chi sta imparando',
      adminId: '2',
      memberIds: ['2', '3'],
      inviteCode: 'NEWBIE',
      createdAt: new Date('2024-12-01')
    }
  ];

  getAll(): Group[] | undefined {
    return this.groups;
  }

  getById(id: string): Group | undefined {
    return this.groups.find((g) => g.id === id);
  }

  getByUserId(userId: string): Group[] | undefined {
    return this.groups.filter((g) => g.memberIds.includes(userId));
  }

  // Omit<TipoOriginale, 'proprietà1' | 'proprietà2'> per creare un nuovo tipo senza alcune proprieta`
  create(group: Omit<Group, 'id' | 'createdAt'>): Group {
    const newGroup: Group = {
      ...group,
      id: Date.now().toString(), //TODO: Andra probabilmente sostituito con l'id generato a backend, al momento inserisco i millisecondi dall'epoch
      createdAt: new Date()
    };

    //TODO: Andra sostituito con la chiamata effettiva
    this.groups.push(newGroup);
    return newGroup;
  }

  // TODO: L'invite code e` da ragionare... dovra` probabilmente essere generato randomicamente
  joinByCode(inviteCode: string, userId: string): Group | undefined {
    const group = this.groups.find((g) => g.inviteCode === inviteCode);
    if (group && !group.memberIds.includes(userId)) {
      group.memberIds.push(userId);
    }
    return group;
  }
}
