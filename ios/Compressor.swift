import Foundation


class Compressor {
    private let fileManager = FileManager()
    
    func archive(fileUrls: [URL], archiveUrl: URL) throws {
        guard let archive = Archive(url: archiveUrl, accessMode: .create) else {
            throw RFLError.archiving(ArchivingError.createionFailed(archivePath: archiveUrl.path))
        }

        for fileUrl in fileUrls {
            try archive.addEntry(
                with: fileUrl.lastPathComponent,
                relativeTo: fileUrl.deletingLastPathComponent()
            )
        }
    }
}
