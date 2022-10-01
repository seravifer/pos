import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TranslationModule } from './i18n.module';
import { AppRoutingModule } from './routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, TranslationModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
