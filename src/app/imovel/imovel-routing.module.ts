import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadImovelComponent } from './pages/cad-imovel/cad-imovel.component';
import { ImovelComponent } from './pages/imovel/imovel.component';

const routes: Routes = [
  { path: '', component: ImovelComponent },
  { path: 'cad-imovel', component: CadImovelComponent },
  { path: 'cad-imovel/:id', component: CadImovelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImovelRoutingModule { }
