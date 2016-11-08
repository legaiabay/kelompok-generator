angular.module('kelGenerator',['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($ionicConfigProvider) {
  //Header title jadi Center
  $ionicConfigProvider.navBar.alignTitle('center');
})

.controller('MainCtrl', function($scope, $ionicPopup, $ionicModal, $timeout, $ionicLoading){
   //Daftar Nama sebelum diacak
  var listNama = [];

  //Banyaknya orang
  var listOrang = 0;

  //Daftar Ketua
  var listKetua = [];

  //Banyak Ketua
  var banyakKetua = 0;
  
  //Data keterangan
  $scope.dataApp = {};

  //Tampilan Form Daftar Orang
  $scope.lihatNamaForm = false;

  //Tampilan Form Daftar Orang kalau kosong
  $scope.namaFormKosong = true;

  //Checkbox ada Ketua
  $scope.adaKetuaHide = true;

  //Daftar nama setelah diacak
  $scope.listNama2 = [[]];

  //Banyak Kelompok
  $scope.daftarKelompok = [];

  //Data Ketua Kelompok
  $scope.dataKetua = listKetua;

  //Simpanan data Daftar Nama
  $scope.dataNama = listNama;

  //generateKelompok() : Buat daftar kelompok dengan anggota acak
  var generateKelompok = function(ketua){
    $scope.daftarKelompok = [];
    $scope.listNama2 = [[]];
    var daftarOrang = [];
    var daftarOrang2 = [[]];
    
    for(i=0;i<listOrang;i++){
      daftarOrang.push(listNama[i].nama);
    }

    daftarOrang = shuffle(daftarOrang);

    if(!ketua){
      for(j=0;j<$scope.dataApp.banyakKelompok;j++){
        $scope.daftarKelompok.push(j+1);
        daftarOrang2[j] = daftarOrang.slice(0,$scope.dataApp.anggotaPerKelompok);
        daftarOrang.splice(0,$scope.dataApp.anggotaPerKelompok);
      }
    } else {
      for(j=0;j<$scope.dataApp.banyakKelompok;j++){
        $scope.daftarKelompok.push(j+1);
        daftarOrang2[j] = daftarOrang.slice(0,$scope.dataApp.anggotaPerKelompok-1);
        daftarOrang.splice(0,$scope.dataApp.anggotaPerKelompok-1);
      }
    }

    $scope.listNama2 = daftarOrang2;
  };

//shuffle() : Acak daftar array dengan metode Fisher-Yates
//Source : https://bost.ocs.org/mike/shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

  //simpanData() : Simpan data keterangan
  $scope.simpanData = function(){
    listNama.length = 0;
    listKetua.length = 0;
    banyakKetua = $scope.dataApp.banyakKelompok;

    if($scope.dataApp.adaKetua){
      listOrang = $scope.dataApp.banyakOrang-$scope.dataApp.banyakKelompok;
    }
    else {
      listOrang = $scope.dataApp.banyakOrang;
    }
    
    if(listOrang > 0){
      for(i=0;i<listOrang;i++){
        listNama.push({
          id : i
        });
      };
      $scope.lihatNamaForm = true;
      $scope.namaFormKosong = false;

       if($scope.dataApp.adaKetua){
        $scope.adaKetuaHide = false;
        for(j=0;j<banyakKetua;j++){
          listKetua.push({
            id : j
          });
        };
      }
      else {
        $scope.adaKetuaHide = true;
      }
    }
  };

 //generateConfirm() = Konfirmasi setelah input nama orang
  $scope.generateConfirm = function(){
    var _generateConfirm = $ionicPopup.confirm({
      title: 'Konfirmasi',
      template : 'Daftar nama sudah benar?'
    });
    _generateConfirm.then(function(res){
      if(res){
        generateKelompok($scope.dataApp.adaKetua);
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        $timeout(function () {
          $ionicLoading.hide();
          showModal($scope.dataApp.adaKetua);
        }, 1000);
      }
    });
  };

  //Setup Modal View untuk daftar kelompok
    $ionicModal.fromTemplateUrl('hasil.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalA = modal;
    });

     $ionicModal.fromTemplateUrl('hasil-ketua.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalB = modal;
    });
  
//showModal() : Menampilkan Modal View Daftar Kelompok
  showModal = function(ketua){
    if(!ketua){
      $scope.modalA.show();
    } else {
      $scope.modalB.show();
    }
  };

  $scope.hideModal = function(){
      $scope.modalA.hide();
      $scope.modalB.hide();
  }
})