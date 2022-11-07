package com.reduxfilelogger.utils

import com.facebook.react.bridge.ReadableMap
import java.io.File

class FileCreator(
  rawFileConfig: ReadableMap,
  private val supportedDirs: Map<String, File>
) {
  private val rootDir: String
  private val nestedDir: String?
  private val fileName: String

  init {
    val fileConfig = FileConfigReader(rawFileConfig).read()
    this.rootDir = fileConfig.rootDir
    this.nestedDir = fileConfig.nestedDir
    this.fileName = fileConfig.fileName
  }

  fun create(): File {
    val rootDirFile = this.getRootDirFile()
    val nestedDirFile = this.createNestedDirIfNotExists(rootDirFile)
    val dirFile = nestedDirFile ?: rootDirFile
    return createOrReplaceFile(dirFile)
  }

  private fun getRootDirFile(): File {
    var rootDirFileFor = this.supportedDirs[this.rootDir]

    if (rootDirFileFor == null) {
      rootDirFileFor = File(this.rootDir)
    }

    if (!rootDirFileFor.exists()) {
      rootDirFileFor.mkdirs()
    }

    return rootDirFileFor
  }

  private fun createNestedDirIfNotExists(rootDirFileFor: File): File? {
    if (this.nestedDir == null) return null

    val nestedDirFile = File(rootDirFileFor, this.nestedDir)

    if (!nestedDirFile.exists()) {
      nestedDirFile.mkdirs()
    }

    return nestedDirFile
  }

  private fun createOrReplaceFile(dirFile: File): File {
    val file = File(dirFile, this.fileName)

    if (file.exists()) {
      file.delete()
    }

    return file
  }
}
