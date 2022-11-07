package com.reduxfilelogger.utils

import android.util.Log
import com.facebook.react.bridge.ReadableMap
import java.io.File

class LogcatLogger(
  private val tag: String,
  rawFileConfig: ReadableMap,
  supportedDirs: Map<String, File>
) {
  private val fileCreator: FileCreator
  lateinit var logFile: File

  init {
    this.fileCreator = FileCreator(rawFileConfig, supportedDirs)
  }

  fun redirectLogcatToNewFile() {
    this.logFile = this.fileCreator.create()
    Log.i("LogcatLogger", logFile.path)
    // clear the previous logcat and then write the new one to the file
    Runtime.getRuntime().exec("logcat -c")
    Runtime.getRuntime().exec("logcat $tag:I *:S -v raw -f $logFile")
  }

  fun log(message: String) {
    Log.i(tag, message)
  }
}
