import Validator from 'ember-validator/validators/validator';
import EmailOrPhone from 'ember-validator/mixins/emailorphone';

export default Validator.extend(EmailOrPhone);
