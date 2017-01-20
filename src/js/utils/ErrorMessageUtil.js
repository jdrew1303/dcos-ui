const MESSAGE_VARIABLE = /\\{\\{([^\\}]+)\\}\\}/g;

const ErrorMessageUtil = {

  replaceMessageVariables(message, variables) {
    return message.replace(MESSAGE_VARIABLE, function (match) {
      return ''+variables[match.slice(2, -2)] || '';
    });
  },

  /**
   * This function returns the `message` of the given array object,
   * with the path and message components concatenated into a uniform
   * string that can be displayed unanchored.
   *
   * @param {Object} error - The error message
   * @param {Array} pathTranslationRules - The path translation rules
   * @returns {String} Returns the composed error string
   */
  getUnanchoredErrorMessage(error, pathTranslationRules) {
    const pathString = error.path.join('.');
    const rule = pathTranslationRules.find(function (rule) {
      return rule.match.exec(pathString);
    });

    const renderedError = ErrorMessageUtil.replaceMessageVariables(
      error.message, error.variables);
    const errorMessage = renderedError[0].toLowerCase() +
      renderedError.substr(1);

    // If no translation found, prefix with the path ID
    if (rule == null) {
      return `${pathString}: ${errorMessage}`;
    }

    // Otherwise prefix with the name from the rule
    return `${rule.name} ${errorMessage}`;
  },

  /**
   * Translate the error messages in the `errors` array, using the translation
   * rules in the `translationRules` array.
   *
   * @param {Array} errors - The list of errors to translate
   * @param {Array} translationRules - The translation rules to use
   * @returns {Array} Returns a new list with the translated error messages
   */
  translateErrorMessages(errors, translationRules) {
    return errors.map(function (error) {
      const {path, type, variables} = error;
      const pathString = path.join('.');

      const rule = translationRules.find(function (rule) {
        return (rule.type === type) && rule.path.exec(pathString);
      });

      // If there is no translation rule, pass-through the message
      if (rule == null) {
        return Object.assign(
          { }
        );
        return error;
      }

      // Return the translated message
      return {
        message: rule.message,
        path,
        type,
        variables
      };
    });
  }

};

module.exports = ErrorMessageUtil;
