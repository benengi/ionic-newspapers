import {Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {INewspaper} from "../../../providers/data/data.interface";
import {DataProvider} from "../../../providers/data/data.provider";
import {UtilityProvider} from "../../../providers/utility/utility.provider";
import {FavoritesProvider} from "../../../providers/favorites/favorites.provider";
import {TabsPage} from "../../tabs/tabs";

const SEARCH_NO_RESULTS = 'No Results Found';

@IonicPage()
@Component({
  selector: 'page-browse-newspapers',
  templateUrl: 'browse-newspapers.html',
})
export class BrowseNewspapersPage {

  region: string = '';
  country: string = '';
  searchTerm: string = '';
  searchMessage: string = SEARCH_NO_RESULTS;
  newspapers: INewspaper[] = [];
  isLoaded: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public dataProvider: DataProvider,
              public utilityProvider: UtilityProvider,
              public favoritesProvider: FavoritesProvider) {
  }

  ionViewDidLoad() {
    this.region = this.navParams.get('region');
    this.country = this.navParams.get('country');

    if (!this.navCtrl.canGoBack()) this.backToHomePage();
    setTimeout(() => this.setFilteredItems(), 350);
  }

  setFilteredItems() {
    this.dataProvider.filterNewspapersForCountry(this.region, this.country, this.searchTerm)
      .then((newspapers: INewspaper[]) => {
        this.newspapers = newspapers;
        this.isLoaded = true;
        if (this.newspapers.length === 0) this.searchMessage = SEARCH_NO_RESULTS;
      });
  }

  onNewspaperClick(newspaper: INewspaper) {
    const actionSheet = this.actionSheetCtrl.create({
      title: newspaper.name,
      buttons: [
        {
          text: 'View',
          handler: () => {
            this.utilityProvider.openBrowser(newspaper.url);
          }
        },
        {
          text: 'Save',
          handler: () => {
            this.favoritesProvider.saveFavorite(newspaper)
              .then(_ => this.utilityProvider.presentToast("Saved Newspaper"))
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  backToHomePage() {
    this.navCtrl.setRoot(TabsPage).then(() => this.navCtrl.popToRoot());
  }

}
