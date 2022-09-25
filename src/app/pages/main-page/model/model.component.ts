import { StateRifas, Irifas } from './../../../interface/irifas';
import { RifasService } from './../../../services/rifas.service';
import { IpriceModel } from './../../../interface/iprice-model';
import { Imodels } from './../../../interface/imodels';
import { ModelsService } from './../../../services/models.service';
import { ModelsDTO } from './../../../dto/models-dto';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IQueryParams } from 'src/app/interface/i-query-params';

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
  public timeSubscriptionInput: any[] = [];
  public price!: IpriceModel | undefined;

  constructor(
    private route: ActivatedRoute,
    private modelsService: ModelsService,
    private rifasService: RifasService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    //Id del modelo
    this.modelId = this.route.snapshot.paramMap.get('url')?.split('_')[1] || '';

    await this.getModel();
    this.getGaleria();
    this.setModelSubscripctionModelValues();
  }

  public async getModel(): Promise<void> {
    let res: Imodels = await this.modelsService
      .getItem(this.modelId || '')
      .toPromise();
    res.id = this.modelId;
    //Interface to DTO
    this.model = await this.modelsService.modelInterfaceToDTO(res);
    this.imgPrincipal = this.model.mainImage || '';
  }

  public async getGaleria(): Promise<void> {
    this.galeria = await this.modelsService.getImages(
      `${this.modelId}/gallery`
    );
  }

  public setImgPrincipal(img: string): void {
    this.imgPrincipal = img;
  }

  public setModelSubscripctionModelValues(): void {
    this.model.price?.forEach((price: IpriceModel) => {
      this.timeSubscriptionInput.push({ time: price.time, checked: false });
    });
  }

  public subscriptionModelInputChange(i: number): void {
    let valueChecked: boolean = this.timeSubscriptionInput[i].checked;

    this.timeSubscriptionInput.forEach((input: any) => {
      input.checked = false;
    });

    this.timeSubscriptionInput[i].checked = !valueChecked;

    if (this.timeSubscriptionInput[i].checked) {
      let price: IpriceModel | undefined = this.model.price?.find(
        (price: IpriceModel) => price.time == this.timeSubscriptionInput[i].time
      );

      this.price = price ? price : undefined;
    } else {
      this.price = undefined;
    }
  }

  public calculoPrecioSubscripcion(): number | undefined {
    if (this.price?.price && this.price?.percentage) {
      return (
        Math.floor(this.price.price * (this.price.percentage / 100) * 100) / 100
      );
    }

    return undefined;
  }

  public async clickParticipar(): Promise<void> {
    let params: IQueryParams = {
      orderBy: '"state"',
      equalTo: `"${StateRifas.ACTIVE}"`,
    };

    try {
      let rifa: Irifas = await this.rifasService.getData(params).toPromise();

      let idRifa: string = Object.keys(rifa)[0];

      this.router.navigateByUrl(`/rifa/${idRifa}`);
    } catch (error) {
      console.error(error);
    }
  }
}
