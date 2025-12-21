import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchesListComponent } from './pages/matches-list/matches-list.component';

const routes: Routes = [
  { path: '', component: MatchesListComponent },
  // TODO: Qui sotto andra messo il componente per la creazione di una nuova partita
  { path: 'create', component: MatchesListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchesRoutingModule {}
