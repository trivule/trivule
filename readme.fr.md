# Quickv

Quickv est une bibliothèque JavaScript légère et facile à utiliser pour la validation côté client des formulaires HTML. Avec Quickv, vous pouvez rapidement et facilement ajouter des règles de validation à vos champs de formulaire en utilisant les attributs HTML personnalisés, sans avoir besoin de beaucoup de code JavaScript supplémentaire. Les attributs HTML personnalisés de Quickv sont simples à comprendre et à utiliser, permettant aux développeurs de mettre en place rapidement un système de validation robuste sans consacrer beaucoup de temps à la création de fonctions de validation personnalisées ou à l'écriture de code JavaScript complexe. Si vous recherchez une solution simple et efficace pour la validation côté client de vos formulaires HTML, Quickv peut être l'outil idéal pour vous.

### Pourquoi utiliser Quickv ?

L'objectif de Quickv est de simplifier le processus de validation et d'économiser du temps aux développeurs, leur permettant de se concentrer sur d'autres aspects du développement de l'application. En offrant une solution de validation rapide et facile à utiliser, **Quickv** peut être un choix attractif pour les développeurs qui recherchent une solution efficace pour ajouter une validation côté client à leurs formulaires HTML sans sacrifier beaucoup de temps dans le processus.

  

## Installation 
Vous pouvez installer ``` Quickv``` de l'une de ses façons
### Via un cdn
Copier le code *Quickv* depuis le cdn et coller dans un fichier `quickv1.0.0.js`, et ensuite incluez le fichier `quickv1.0.0.js` dans votre projet
[Copier le code](https://cdn.jsdelivr.net/npm/quickv@1.0.0/dist/index.js).
Vous pouvez faire simple en copiant la balise suivante avant la balise body de votre structure HTML
```html
<script  src="https://cdn.jsdelivr.net/npm/quickv@1.0.0/dist/index.js"></script>
```
### via npm 
Aller à la racine du projet où vous souhaitez utiliser `Quickv`, ouvrez votre terminal et taper:
```bash
    npm install quickv
```

Vous pouvez alors utilisez `Quickv` dans votre projet en l'important:
```js
  import * as quickv from "quickv";
  const qv= new quickv.Quickv()
  qv.init()
```

## Utilisation

Quickv offre trois méthodes de validation : la validation isolée d'un champ de saisie (**input**), la validation isolée d'un formulaire (**form**) ou la validation générale de tous les formulaires de votre site.
Cela vous permet de choisir la méthode qui convient le mieux à vos besoins et de valider efficacement les données soumises par les utilisateurs, que ce soit pour un champ unique, un formulaire entier ou pour l'ensemble des formulaires présents sur votre site web.

1- Pour effectuer la validation d'un champ de saisie (**input**) individuel, vous pouvez utiliser la classe `QvInput`. Cette classe prend en paramètres de son constructeur un sélecteur CSS valide pour identifier le champ à valider, une configuration `QvConfig` (optionnelle) et un booléen (optionnel) indiquant si l'événement **qv.input.validated** sera déclenché. Cet événement permet de savoir quand le champ a été modifié et validé.
Ex:

```js
const qv = new QvInput(inputSelector);
qv.init();
```

2- Pour valider un seul formulaire, vous pouvez utiliser la classe `QvForm` de Quickv. Il suffit de lui fournir un sélecteur CSS valide pour retrouver le formulaire à valider dans son constructeur, puis d'appeler la méthode `init()` pour initialiser la validation.

```js
const qv = new QvForm(inputSelector);
qv.init();
```

3- Pour valider tous les formulaires de votre site de façon générale, vous pouvez utiliser la classe `Qv` ou `Quickv` de Quickv. Ces classes ne prennent rien dans leur constructeur et recherchent tous les formulaires de votre site pour leur appliquer une instance de `QvForm`. Cependant, veuillez noter que cette méthode peut ne pas fonctionner correctement avec certains frameworks comme Angular qui manipulent le DOM de manière spécifique. Dans ce cas, vous pouvez utiliser les méthodes 1 et 2 pour une meilleure intégration.

```js
const qv = new Qv();
qv.init();
```

En utilisant ces classes, vous pouvez facilement valider vos formulaires avec Quickv, mais assurez-vous de prendre en compte les spécificités de votre framework ou de votre environnement de développement pour une intégration optimale.

### Dans HTML et CSS Vanilla

- Copiez et incluez le fichier `quickv.js` dans votre projet avec la balise `script`
- Initialisez comme ci:

```js
const qv = new Qv();
qv.init();
```

C'est tout, ce que vous avez à faire comme javascript, si vous n'avez aucune erreur dans la console, c'est que vous pouvez tester Quickv

- Créer un formulaire HTML, avec la balise `form`
- Créez un champ que vous souhaitez valider et ajoutez les attributs comme l'exemple ci-dessous
  Ex:

```html
<form action="">
  <div>
    <input
      type="text"
      name="age"
      data-qv-rules="required|number|between:18,35"
      data-qv-messages="L'âge est requis | L'âge doit être un nombre | L'âge doit être compris entre 18 et 35"
    />
    <div data-qv-feedback="age"></div>
  </div>
  <button data-qv-submit>Submit</button>
</form>
```

En tapant dans le champ d'âge et en soumettant le formulaire en cliquant sur le bouton "Soumettre", Quickv validera automatiquement les données soumises en fonction des règles de validation définies et affichera les messages d'erreur appropriés dans l'élément HTML avec l'attribut `data-qv-feedback` si les données ne sont pas valides.

Si vous ne souhaitez pas désactiver le formulaire par défaut, il vous suffit de supprimer l'attribut `data-qv-submit` du bouton de soumission dans votre code HTML.

### Dans Angular

### Dans Reactjs

Vous pouvez voir une démo d'utilisation de Quickv avec Reactjs [ici](https://meschack.github.io/quickv-test)

## Customisation

Quickv vous de nombreux attributs pour valider votre formulaire sans écrire le moindre code JS

### Afficher les messages d'erreur

Par défaut, les messages d'erreur sont en anglais. Cependant, vous pouvez les modifier pour les adapter à une règle spécifique sur un champ en utilisant l'attribut `data-qv-messages`. Les messages sont séparés par le symbole pipe (|) dans l'ordre où vous avez défini vos règles. _ Vous pouvez également mettre les messages dans n'importe quel ordre en précisant les règles pour lesquelles vous avez défini les messages. Par exemple, si vous avez une règle `required|min:x|max:x`, vous pouvez définir le message pour la règle "min" et "max" en utilisant `data-qv-messages="{1}Le message pour min|{2}Le message pour max"`. Les nombres entre les accolades correspondent aux positions des règles, la première règle étant à la position 0. _ Parfois, il est pratique d'avoir un message d'erreur pour plusieurs règles. Vous pouvez le faire en spécifiant les positions des règles concernées par le message. Par exemple, `data-qv-messages="Ce champ est requis|{1,2}Veuillez saisir un nombre entre x et y"`.

L'attribut `data-qv-feedback="le_nom_du_champ"` vous permet d'afficher le message d'erreur où vous le souhaitez. Vous pouvez le placer n'importe où sur la page, Quickv le retrouvera et lui affectera le message d'erreur.

Si vous avez un champ avec le nom "xxx", Quickv essaiera de trouver le premier élément HTML ayant l'attribut `data-qv-feedback=xxx` le plus proche du champ en question. Si aucun élément n'est trouvé, il ne fera rien.

> Parfois, vous pouvez ne pas vouloir utiliser le nom directement sur un champ HTML. L'attribut `data-qv-name` vous permet de donner un nom à votre formulaire.

### Affichage des erreurs dans Quickv

Quickv propose différentes façons d'afficher les erreurs dans un formulaire. Si vous voulez afficher tous les messages d'erreur une fois que la première règle a échoué, vous pouvez utiliser l'attribut `data-qv-show`. Il accepte trois valeurs possibles : `first`, `full` et `last`.

Par défaut, la valeur est `first`, ce qui signifie que seul le premier message d'erreur sera affiché. Si vous choisissez la valeur `full`, tous les messages d'erreur pour toutes les règles seront affichés. Enfin, si vous choisissez `last`, seul le dernier message d'erreur sera affiché.

### Evénements pour déclencher la validation

Si vous souhaitez déclencher la validation d'un champ selon certains événements, tels que `mouseover` ou `focus`, vous pouvez ajouter l'attribut `data-qv-events` à l'élément HTML qui a l'attribut `data-qv-rules`. Vous pouvez spécifier les événements que vous souhaitez, séparés par des pipes (`|`). N'hésitez pas à tester cette fonctionnalité !

### Personnaliser le style du champ

Il peut arriver que vous souhaitiez appliquer un style spécifique à un champ en fonction de son état de validité (valide ou invalide). Pour cela, vous pouvez utiliser les attributs `data-qv-invalid-class` et `data-qv-valid-class`. Par exemple, vous pouvez définir `data-qv-invalid-class` avec la valeur "invalid-css" pour appliquer une classe CSS spécifique lorsque le formulaire est invalide. Ainsi, les classes que vous avez définies seront automatiquement appliquées en fonction de l'état de validité du formulaire.

### Quelques règles de validation que vous pouvez tester

###### Règles générales

- **required**: La valeur est obligatoire.
- **nullable**: La valeur peut être nulle, elle sera simplement ignorée.
- **min:x**: Vérifie si la valeur du champ est supérieure ou égale à `x`. Cette règle peut être utilisée pour valider les nombres, les chaînes de caractères et les fichiers.
  - Si le champ est un nombre ou une chaîne de caractères, la valeur de `x` doit être un nombre entier.
  - Si le champ est un fichier, la valeur de `x` doit être exprimée en B, KB, MB ou GB. Exemple : 2MB, 1KB, 3GB.
- **max:x**: Vérifie si la valeur du champ est inférieure ou égale à la valeur maximale spécifiée. Cette règle fonctionne de la même manière que la règle `min`.
- **in:x,x,z,...**: La règle de validation _in_ permet de vérifier si l'entrée utilisateur est incluse dans une liste de valeurs spécifiées.
- **size:x**: Cette règle est à utiliser avec prudence.
  - Si la valeur entrée est un fichier, elle vérifie si la taille du fichier est inférieure ou égale à `x` (B, KB, MB ou GB).
  - Si la valeur est une chaîne de caractères, elle vérifie si la longueur de la chaîne est exactement `x` (un nombre entier).
  - Si la valeur est un nombre, elle passe si le nombre de chiffres (y compris les séparateurs) est exactement `x` (un nombre entier).
- **between:x,y**: Passe si la valeur du champ est comprise entre `x` et `y`.
  - Si le champ est un nombre, `x` et `y` doivent être des nombres.
  - Si le champ est une date, `x` et `y` doivent être également des dates valides.
  - Si le champ est un fichier, `x` et `y` doivent être exprimées en B, KB, MB ou GB.

##### Règles pour les chaînes de caractères

Voici quelques règles de validation qui s'appliquent aux chaînes de caractères :

- **email**: Passe si la chaîne est une adresse e-mail valide.
- **password**: Passe si la chaîne respecte les conventions suivantes :
  - Avoir une longueur minimale de 8 caractères.
  - Contenir au moins une lettre majuscule et une lettre minuscule.
  - Contenir au moins l'un des caractères suivants : **!@#$%^&\*(),.?":{}|<>**.
- **string**: Passe si la valeur est une chaîne de caractères.
- **contains:x,y,...etc** : Vérifie si la valeur du champ contient l'une des sous-chaînes spécifiées. Exemple : contains:http,ftp,ssh Si le champ du formulaire contient au moins l'une de ces valeurs, la règle passe.
- **minlength:x** : Vérifie si la longueur d'une chaîne est supérieure ou égale au nombre minimal spécifié `x`.
- **maxlength:x** : Vérifie si la longueur d'une chaîne est inférieure ou égale au nombre maximal spécifié `x`. Les règles `minlength` et `maxlength` s'appliquent uniquement aux chaînes de caractères, et échouent pour tout autre type de données.
- **url** : Vérifie si la valeur entrée est une URL valide.
- **startWithUpper**: Vérifie si la chaîne commence par une lettre majuscule.
- **startWithLower**: Vérifie si la chaîne commence par une lettre minuscule.
- **startWith:x,x,...**: Passe si la chaîne commence par l'une des valeurs spécifiées `x,y,z`.
- **endWith:x,x,...**: Passe si la chaîne se termine par l'une des valeurs spécifiées `x,y,z`.
- **length:x** ou **len:x**: Passe si la longueur de la chaîne de caractères est exactement `x`.

######

Ces règles s'appliquent spécialement aux nombres
**numeric** ou **number**: Passe si la valeur est un nombre
**integer** ou **int**: Passe si la valeur est un nombre entier

##### Les fichiers

Ces règles s'appliquent aux fichiers et devraient échouer pour tout autre type de données

**file**: Passe si la valeur est un fichier
**maxFileSize:x**: Passe si le fichier a une taille inférieure ou égale à `x` (**B,KB,MB,GB)
**minFileSize:x**: Passe si le fichier a une taille supérieure ou égale à `x` (**B,KB,MB,GB)

### Les dates

**date** : La règle passe si la valeur du champ est une date valide. Cette règle peut être utilisée pour valider les dates dans les formulaires et s'assurer qu'elles sont au bon format.
**before:date** : La règle passe si la valeur du champ est une date antérieure à la date spécifiée `date`. Cette règle peut être utilisée pour valider les dates dans les formulaires et s'assurer qu'elles sont antérieures à une date de référence donnée. La date doit être spécifiée dans un format valide.
**after:date** : La règle passe si la valeur du champ est une date postérieure à la date spécifiée `date`. Cette règle peut être utilisée pour valider les dates dans les formulaires et s'assurer qu'elles sont ultérieures à une date de référence donnée. La date doit être spécifiée dans un format valide.

##### Les booléens

Ces règles s'appliquent booléens
**boolean**: Passe si la valeur est un booléan. Si la valeur est **_yes_** ou **_no_**, la règle passe également
Les valeurs: (true, 1, 0, yes, no)

### Ajouter de nouvelles règles

C'est très simple pour ajouter de nouvelles règles

#### Ecrivez votre règle:

Une règle c'est juste une fonction javascript qui prend en paramètre deux paramètres et retourne obligatoirement un booléen

1. La valeur à valider (la valeur actuelle de l'input)
2. Les paramètres (optionnels): Ce sont les valeurs après les deux-points (:)

```js
const unique = (input) => {
  // appel à une api par exemple pour voir si la donnée existe dans la base de donnée
  return false;
};
```

Ajouter vos messages et règles à l'instance de `Quickv`, mais avant la méthode _init()_

```js
qv.rule("unique", unique, "Ce champs doit être unique");
qv.init();
```

Une fois ceci fait, c'est fini, vous pouvez utiliser vos règles comme des attributs html


### Documentation et Test
Français: [Documentation](https://github.com/quick-v/quickv/blob/main/readme.fr.md)

Anglais: [Documentation](https://github.com/quick-v/quickv/blob/main/readme.md)


### Contribution

Les contributions sont toujours les bienvenues !

Consultez le fichier `contributing.md` pour savoir comment commencer.

Veuillez vous conformer au `code de conduite` de ce projet.



### License

Ce projet est sous licence MIT. Consultez le fichier **LICENSE** pour plus de détails.

### Credits

Cette bibliothèque a été développée par [Claude Fassinou](https://github.com/Claudye) pour [Quickv](https://github.com/quickv).
**_Happy coding_**
