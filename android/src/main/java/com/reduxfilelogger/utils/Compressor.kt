package com.reduxfilelogger.utils

import java.io.*
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class Compressor(private val zipFile: File) {
  private val buffer = ByteArray(BUFFER_SIZE)

  fun zip(files: List<File>) {
    val output = ZipOutputStream(BufferedOutputStream(FileOutputStream(zipFile)))
    files.forEach{ file -> zip(file, output) }
    output.close()
  }

  private fun zip(
    file: File,
    output: ZipOutputStream = ZipOutputStream(BufferedOutputStream(FileOutputStream(zipFile)))
  ) {
    val filePath = file.path
    val input = BufferedInputStream(FileInputStream(file), BUFFER_SIZE)
    val entry = ZipEntry(filePath.substring(filePath.lastIndexOf("/") + 1))
    output.putNextEntry(entry)
    var count: Int
    while (input.read(buffer, 0, BUFFER_SIZE).also { count = it } != -1) {
      output.write(buffer, 0, count)
    }
    input.close()
  }

  companion object {
    private const val BUFFER_SIZE = 2048
  }
}
