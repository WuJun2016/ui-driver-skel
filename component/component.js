/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
import NodeDriver from 'shared/mixins/node-driver';

// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
/*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/
import { throttledObserver } from 'ui/utils/debounce';

/*!!!!!!!!!!!GLOBAL CONST START!!!!!!!!!!!*/
// EMBER API Access - if you need access to any of the Ember API's add them here in the same manner rather then import them via modules, since the dependencies exist in rancher we dont want to expor the modules in the amd def
const computed     = Ember.computed;
const observer     = Ember.observer;
const get          = Ember.get;
const set          = Ember.set;
const setProperties= Ember.setProperties;
const alias        = Ember.computed.alias;
const service      = Ember.inject.service;
const EmberPromise = Ember.RSVP.Promise;
const all          = Ember.RSVP.all;
const next         = Ember.run.next;
/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/

const languages = {
  'en-us':   {"nodeDriver":{"harvester":{"cloudconfig":{"label":"Cloud Config YAML"},"imageName":{"label":"Image"},"diskBus":{"label":"Bus"},"access":{"title":"1. Account Access","detail":"Configure where to find the Harvester server"},"instance":{"title":"2. Instance Options","detail":"Choose the size and OS of the virtual machine"},"host":{"label":"Host","placeholder":"IP/domain"},"port":{"label":"Port"},"username":{"label":"Username"},"internal":"Internal Harvester","external":"External Harvester","sshUser":{"label":"SSH User"},"networkName":{"label":"Network Name"},"password":{"label":"Password"},"cpuCount":{"label":"CPUs","unit":"{cores, plural, =1 {Core} other {Cores}}"},"memorySize":{"label":"Memory","unit":"GiB"},"diskSize":{"label":"Disk","unit":"GiB"},"cloudConfig":{"label":"Cloud config"},"cloudinit":{"label":"Cloud Init"}}}},
  'zh-hans': {"nodeDriver":{"harvester":{"cloudconfig":{"label":"Cloud Config YAML"},"imageName":{"label":"镜像"},"diskBus":{"label":"磁盘 Bus"},"access":{"title":"1. 帐户访问","detail":"配置在哪里查找 Harvester 服务器"},"instance":{"title":"2. 实例配置","detail":"选择虚拟机的大小和操作系统"},"host":{"label":"主机","placeholder":"IP/Domain"},"port":{"label":"端口"},"username":{"label":"用户名"},"internal":"内部 Harvester","external":"外部 Harvester","sshUser":{"label":"SSH 用户名"},"networkName":{"label":"网络"},"password":{"label":"密码"},"cpuCount":{"label":"CPUs","unit":"{cores, plural, =1 {Core} other {Cores}}"},"memorySize":{"label":"内存","unit":"GiB"},"diskSize":{"label":"磁盘","unit":"GiB"},"cloudConfig":{"label":"Cloud config"},"cloudinit":{"label":"Cloud Init"}}}}
};

const BUS_OPTION = [{
  label: 'VirtIO',
  value: 'virtio'
},
{
  label: 'SATA',
  value: 'sata'
},
{
  label: 'SCSI',
  value: 'scsi'
}];

/*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
export default Ember.Component.extend(NodeDriver, {
  driverName: '%%DRIVERNAME%%',
  config:     alias('model.%%DRIVERNAME%%Config'),
  app:        service(),

  busContent:     BUS_OPTION,
  configField:    'harvesterConfig',
  lanChanged:     null,
  refresh:        false,

  imageContent: [],
  networkContent: [],
  controller:  null,
  signal: '',
  isInternalMode:  true,

  init() {
    // This does on the fly template compiling, if you mess with this :cry:
    const decodedLayout = window.atob(LAYOUT);
    const template      = Ember.HTMLBars.compile(decodedLayout, {
      moduleName: 'nodes/components/driver-%%DRIVERNAME%%/template'
    });
    set(this,'layout', template);

    this._super(...arguments);

    const lang = get(this, 'session.language');
    get(this, 'intl.locale');
    this.loadLanguage(lang);

    const controller = new AbortController();
    set(this, 'controller', controller);
    this.fetchImage()

    if (get(this, 'config').clusterType === 'internal') {
      set(this, 'isInternalMode', true);
    } else {
      set(this, 'isInternalMode', false);
    }
  },
  /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/
  changeMode: observer('isInternalMode', function() {
    if (get(this, 'isInternalMode')) {
      set(this, 'config.host', '');
      set(this, 'config.port', '');
      set(this, 'config.clusterType', 'internal')
    } else {
      set(this, 'config.imageName', '');
      set(this, 'config.networkName', '');
      set(this, 'config.clusterType', 'external')
    }
  }),

  fetchImage: throttledObserver('config.host', 'config.port', async function() {
    let controller = get(this, 'controller');
    let signal = get(this, 'signal');
    let cur = window.document.location.href;
    let pathname = window.document.location.pathname;
    let pos = cur.indexOf( pathname );
    let localhostPath = cur.substring( 0, pos );
    
    signal = controller.signal;
    set(this, 'signal', signal);

    const imageContent = get(this, 'imageContent');
    if (!imageContent.length) {
      get(this, 'globalStore').rawRequest({
        url:  `${localhostPath}/v1/harvesterhci.io.virtualmachineimages`,
      }).then((resp) => {
        const data = resp.body.data || [];
        const arr = data.filter( O => {
          return !O.spec.displayName.endsWith('.iso');
        }).map( O => {
          const value = O.metadata.name;
          const label = `${ O.spec.displayName } (${value})`;
          return {
            label,
            value
          }
        });

        if (arr.length) {
          set(this, 'imageContent', arr);
        } else {
          set(this, 'imageContent', []);
        }
      }).catch((err) => {
        set(this, 'imageContent', []);
      });

    }

    const networkContent = get(this, 'networkContent');
    if (!networkContent.length) {
      get(this, 'globalStore').rawRequest({
        url:  `${localhostPath}/v1/k8s.cni.cncf.io.networkattachmentdefinition`,
      }).then((resp) => {
        const data = resp.body.data || [];
        const arr = data.map( O => {
          let id = '';
          try {
            const config = JSON.parse(O.spec.config);
            id = config.vlan;
          } catch(err) {
            console.log(err)
          }

          const value = O.metadata.name;
          const label = `${value} (vlanId=${id})`;
          return {
            label,
            value
          }
        });

        if (arr.length) {
          set(this, 'networkContent', arr);
        } else {
          set(this, 'networkContent', []);
        }
      }).catch((err) => {
        set(this, 'networkContent', []);
      });
    }

    controller.abort()
  }),

  // Write your component here, starting with setting 'model' to a machine with your config populated
  bootstrap: function() {
    // bootstrap is called by rancher ui on 'init', you're better off doing your setup here rather then the init function to ensure everything is setup correctly
    let config = get(this, 'globalStore').createRecord({
      type: '%%DRIVERNAME%%Config',
      host:         '',
      port:         '',
      username:     '',
      password:     '',
      cpuCount:     2,
      memorySize:   4,
      diskSize:     40,
      diskBus:      'virtio',
      imageName:    '',
      sshUser:      '',
      networkName:  '',
      clusterType:  'internal',
      cloudConfig:  '#cloud-config\n\n',
    });

    set(this, 'model.%%DRIVERNAME%%Config', config);
  },

  // Add custom validation beyond what can be done from the config API schema
  validate() {
    // Get generic API validation errors
    this._super();
    var errors = get(this, 'errors')||[];
    const intl = get(this, 'intl');

    if ( !get(this, 'model.name') ) {
      errors.push(intl.t("nodeDriver.nameError"));
    }

    // Add more specific errors
    if (!get(this, 'config.host') && !get(this, 'isInternalMode')) {
      errors.push(intl.t('generic.required', {
        key: intl.t("nodeDriver.harvester.host.label")
      }));
    }

    if (!get(this, 'config.port') && !get(this, 'isInternalMode')) {
      errors.push(intl.t('generic.required', {
        key: intl.t("nodeDriver.harvester.port.label")
      }));
    }

    if (!get(this, 'config.username')) {
      errors.push(intl.t('generic.required', {
        key: intl.t("nodeDriver.harvester.username.label")
      }));
    }

    if (!get(this, 'config.password')) {
      errors.push(intl.t('generic.required', {
        key: intl.t("nodeDriver.harvester.password.label")
      }));
    }

    if (!get(this, 'config.diskBus')) {
      errors.push(intl.t('generic.required', {
        key: intl.t("nodeDriver.harvester.diskBus.label")
      }));
    }

    if (!get(this, 'config.imageName')) {
      errors.push(intl.t('generic.required', {
        key: intl.t("nodeDriver.harvester.imageName.label")
      }));
    }

    if (!get(this, 'config.networkName')) {
      errors.push(intl.t('generic.required', {
        key: intl.t("nodeDriver.harvester.networkName.label")
      }));
    }

    if (!get(this, 'config.sshUser')) {
      errors.push(intl.t('generic.required', {
        key: intl.t("nodeDriver.harvester.sshUser.label")
      }));
    }
    // Set the array of errors for display,
    // and return true if saving should continue.
    if ( get(errors, 'length') ) {
      set(this, 'errors', errors);
      return false;
    } else {
      set(this, 'errors', null);
      return true;
    }
  },

  // Any computed properties or custom logic can go here
  loadLanguage(lang) {
    const translation = languages[lang] || languages['en-us'];
    const intl = get(this, 'intl');

    if (intl.addTranslation) {
      intl.addTranslation(lang, 'nodeDriver.harvester', translation.nodeDriver.harvester);
    } else {
      intl.addTranslations(lang, translation);
    }
    intl.translationsFor(lang);
    set(this, 'refresh', false);
    next(() => {
      set(this, 'refresh', true);
      set(this, 'lanChanged', +new Date());
    });
  },

  languageDidChanged: observer('intl.locale', function() {
    const lang = get(this, 'intl.locale');
    if (lang) {
      this.loadLanguage(lang[0]);
    }
  }),
});
