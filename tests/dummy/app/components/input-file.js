import Ember from 'ember';

const { TextField } = Ember;

export default TextField.extend({
  type: 'file',
  files: null,
  attributeBindings: ['files'],

  change(event) {
    const files     = event.target.files;
    const onChange  = this.attrs.onChange;
    this.set('files', files);
    if (onChange) {
      onChange();
    }
  }
});
