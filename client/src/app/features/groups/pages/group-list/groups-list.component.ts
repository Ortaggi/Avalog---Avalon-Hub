import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GroupService } from '../../../../shared/services/groups.service';
import { Group } from '../../../../shared/models';

@Component({
  selector: 'app-groups-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [GroupService],
  templateUrl: './groups-list.component.html',
  styleUrl: './groups-list.component.scss',
})
export class GroupsListComponent implements OnInit {
  private groupService = inject(GroupService);
  private cdr = inject(ChangeDetectorRef);

  groups: Group[] = [];
  isLoading = true;
  errorMessage = '';

  async ngOnInit(): Promise<void> {
    await this.loadGroups();
  }

  private async loadGroups(): Promise<void> {
    this.isLoading = true;
    try {
      this.groups = await this.groupService.getAll();
    } catch (error) {
      console.error('Errore nel caricamento dei gruppi!', error);
      this.errorMessage = 'Errore nel caricamento dei gruppi!';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
