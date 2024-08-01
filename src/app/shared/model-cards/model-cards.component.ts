import { Component, Input } from '@angular/core';
import { ModelsDTO } from 'src/app/dto/models-dto';
import { Icategories } from 'src/app/interface/icategories';
import { ModelsService } from 'src/app/services/models.service';
import { FontAwesomeIconsService } from '../font-awesome-icons/font-awesome-icons.service';

@Component({
  selector: 'app-model-cards',
  templateUrl: './model-cards.component.html',
  styleUrls: ['./model-cards.component.css'],
})
export class ModelCardsComponent {
  @Input() model: ModelsDTO;
  @Input() categories: Icategories[];

  constructor(
    private modelsService: ModelsService,
    public fontAwesomeIconsService: FontAwesomeIconsService
  ) {}

  public getUrlModel(model: ModelsDTO) {
    return this.modelsService.getRouterLinkUrl(model);
  }

  public findCategorie(id: string): Icategories {
    return this.categories.find((c: Icategories) => c.id === id) || null;
  }
}
