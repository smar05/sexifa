import { Imodels } from './../../../interface/imodels';
import { ModelsService } from './../../../services/models.service';
import { ModelsDTO } from './../../../dto/models-dto';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css'],
})
export class ModelComponent implements OnInit {
  public model: ModelsDTO = {};
  public modelId: string = '';

  constructor(
    private route: ActivatedRoute,
    private modelsService: ModelsService
  ) {}

  ngOnInit(): void {
    //Id del modelo
    this.modelId = this.route.snapshot.paramMap.get('url')?.split('_')[1] || '';

    this.getModel();
  }

  public getModel(): void {
    this.modelsService
      .getItem(this.modelId || '')
      .subscribe(async (res: Imodels) => {
        res.id = this.modelId;
        //Interface to DTO
        this.model = await this.modelsService.modelInterfaceToDTO(res);
      });
  }
}
