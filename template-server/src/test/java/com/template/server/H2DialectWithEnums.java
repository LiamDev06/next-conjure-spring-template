package com.template.server;

import org.hibernate.boot.model.TypeContributions;
import org.hibernate.dialect.H2Dialect;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.type.SqlTypes;
import org.hibernate.type.descriptor.sql.internal.DdlTypeImpl;
import org.hibernate.type.descriptor.sql.spi.DdlTypeRegistry;

/**
 * Custom H2 dialect to support enum types. Will otherwise cause issues when @JdbcTypeCode is used
 * in the app, which is required for typed postgres enums to work.
 */
public class H2DialectWithEnums extends H2Dialect {

    @Override
    public void contributeTypes(final TypeContributions typeContributions, final ServiceRegistry serviceRegistry) {
        super.contributeTypes(typeContributions, serviceRegistry);

        final DdlTypeRegistry ddlTypeRegistry =
                typeContributions.getTypeConfiguration().getDdlTypeRegistry();
        ddlTypeRegistry.addDescriptor(new DdlTypeImpl(SqlTypes.NAMED_ENUM, "varchar(255)", this));
    }
}
