import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'',loadChildren: () => import('../app/starter/starter.module').then((m) => m.StarterModule)},
  {path:'home',loadChildren: () => import('../app/main/main.module').then((m) => m.MainModule)}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
