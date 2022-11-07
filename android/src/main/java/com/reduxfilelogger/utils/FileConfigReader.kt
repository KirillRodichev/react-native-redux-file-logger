package com.reduxfilelogger.utils

import com.facebook.react.bridge.ReadableMap
import com.reduxfilelogger.IncompleteFileConfigurationError

data class FileConfig(val rootDir: String, val nestedDir: String?, val fileName: String)

class FileConfigReader(rawFileConfig: ReadableMap) {
  private val fileConfig: FileConfig

  init {
    val rootDir = rawFileConfig.getString(FileConfigKeys.ROOT_DIR.key)
    val nestedDir = rawFileConfig.getString(FileConfigKeys.NESTED_DIR.key)
    val fileName = rawFileConfig.getString(FileConfigKeys.FILE_NAME.key)

    if (rootDir == null || fileName == null) {
      throw IncompleteFileConfigurationError()
    }

    this.fileConfig = FileConfig(rootDir, nestedDir, fileName)
  }

  fun read(): FileConfig {
    return this.fileConfig
  }

  companion object {
    enum class FileConfigKeys(val key: String) {
      ROOT_DIR("rootDir"),
      NESTED_DIR("nestedDir"),
      FILE_NAME("fileName")
    }
  }
}
