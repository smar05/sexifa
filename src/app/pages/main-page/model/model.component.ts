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
  public galeria: string[] = [];
  public imgPrincipal: string = '';

  constructor(
    private route: ActivatedRoute,
    private modelsService: ModelsService
  ) {}

  ngOnInit(): void {
    //Id del modelo
    this.modelId = this.route.snapshot.paramMap.get('url')?.split('_')[1] || '';

    this.getModel();
    this.getGaleria();
  }

  public getModel(): void {
    this.modelsService
      .getItem(this.modelId || '')
      .subscribe(async (res: Imodels) => {
        res.id = this.modelId;
        //Interface to DTO
        this.model = await this.modelsService.modelInterfaceToDTO(res);
        this.imgPrincipal = this.model.mainImage || '';
      });
  }

  public async getGaleria(): Promise<void> {
    this.galeria = await this.modelsService.getImages(
      `${this.modelId}/gallery`
    );
  }

  public setImgPrincipal(img: string): void {
    this.imgPrincipal = img;
  }
}
